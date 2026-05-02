package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.ShopRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.UserRepository;
import com.omnishop360.backend.infrastructure.adapter.KeycloakAdapter;
import com.omnishop360.backend.web.dto.CreateCashierRequest;
import com.omnishop360.backend.web.dto.CreateShopAdminRequest;
import com.omnishop360.backend.web.dto.CreateStockManagerRequest;
import com.omnishop360.backend.web.dto.CreateShopRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.ShopResponse;
import com.omnishop360.backend.web.dto.UpdateShopRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShopService {

    private static final String SHOP_NOT_FOUND_WITH_ID = "Shop not found with id: ";
    private static final String SHOP_ID_ATTRIBUTE = "shop_id";

    private final ShopRepository shopRepository;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final KeycloakAdapter keycloakAdapter;
    private final UserContextService userContextService;

    @Transactional
    public ShopResponse createShop(CreateShopRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Creating shop: {} for tenant: {}", request.getName(), tenantId);

        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));

        String code = generateShopCode(request.getName(), tenantId);

        Shop shop = new Shop();
        shop.setTenant(tenant);
        shop.setName(request.getName());
        shop.setCode(code);
        shop.setAddress(request.getAddress());
        shop.setCity(request.getCity());
        shop.setPostalCode(request.getPostalCode());
        shop.setCountry(request.getCountry());
        shop.setPhone(request.getPhone());
        shop.setEmail(request.getEmail());
        shop.setAllowSaleWithoutStock(Boolean.TRUE.equals(request.getAllowSaleWithoutStock()));
        shop.setActive(true);
        shop.setDeleted(false);

        shop = shopRepository.save(shop);
        log.info("Shop created successfully: {}", shop.getId());
        return ShopResponse.from(shop);
    }

    @Transactional
    public ShopResponse updateShop(UUID shopId, UpdateShopRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Updating shop: {} for tenant: {}", shopId, tenantId);

        Shop shop = shopRepository.findByIdAndDeletedFalse(shopId)
                .orElseThrow(() -> new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + shopId));

        if (!shop.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + shopId);
        }

        shop.setName(request.getName());
        shop.setAddress(request.getAddress());
        shop.setCity(request.getCity());
        shop.setPostalCode(request.getPostalCode());
        shop.setCountry(request.getCountry());
        shop.setPhone(request.getPhone());
        shop.setEmail(request.getEmail());
        if (request.getAllowSaleWithoutStock() != null) {
            shop.setAllowSaleWithoutStock(request.getAllowSaleWithoutStock());
        }

        shop = shopRepository.save(shop);
        log.info("Shop updated successfully: {}", shop.getId());
        long userCount = userRepository.countByShopId(shop.getId());
        ShopResponse response = ShopResponse.from(shop);
        if (response != null) {
            response.setUserCount((int) userCount);
        }
        return response;
    }

    @Transactional(readOnly = true)
    public PageResponse<ShopResponse> getAllShops(Pageable pageable, String search) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.debug("Fetching shops for tenant: {} with search: {}", tenantId, search);

        Page<Shop> shops;
        if (search != null && !search.trim().isEmpty()) {
            shops = shopRepository.findByTenantIdAndDeletedFalseWithSearch(tenantId, search.trim(), pageable);
        } else {
            shops = shopRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        }

        Page<ShopResponse> responsePage = shops.map(shop -> {
            long userCount = userRepository.countByShopId(shop.getId());
            ShopResponse response = ShopResponse.from(shop);
            if (response != null) {
                response.setUserCount((int) userCount);
            }
            return response;
        });

        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public ShopResponse getShopById(UUID shopId) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.debug("Fetching shop: {} for tenant: {}", shopId, tenantId);

        Shop shop = shopRepository.findByIdAndDeletedFalse(shopId)
                .orElseThrow(() -> new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + shopId));

        if (!shop.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + shopId);
        }

        long userCount = userRepository.countByShopId(shop.getId());
        ShopResponse response = ShopResponse.from(shop);
        if (response != null) {
            response.setUserCount((int) userCount);
        }
        return response;
    }

    @Transactional
    public User createShopAdmin(CreateShopAdminRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Creating shop admin: {} for shop: {}", request.getEmail(), request.getShopId());

        Shop shop = shopRepository.findByIdAndDeletedFalse(request.getShopId())
                .orElseThrow(() -> new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + request.getShopId()));

        if (!shop.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + request.getShopId());
        }

        if (userRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
            throw new IllegalArgumentException("User with email already exists: " + request.getEmail());
        }

        String keycloakId = keycloakAdapter.createUser(
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                "shop_admin"
        );

        keycloakAdapter.setUserAttribute(keycloakId, SHOP_ID_ATTRIBUTE, shop.getId().toString());

        User admin = new User();
        admin.setTenant(shop.getTenant());
        admin.setShop(shop);
        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setEmail(request.getEmail());
        admin.setKeycloakId(keycloakId);
        admin.setActive(true);
        admin.setDeleted(false);
        admin = userRepository.save(admin);

        log.info("Shop admin created successfully: {} for shop: {}", admin.getId(), shop.getId());
        return admin;
    }

    @Transactional
    public User createCashier(UUID shopId, CreateCashierRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Creating cashier: {} for shop: {}", request.getEmail(), shopId);

        Shop shop = shopRepository.findByIdAndDeletedFalse(shopId)
                .orElseThrow(() -> new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + shopId));

        if (!shop.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + shopId);
        }

        var currentUserShopId = userContextService.getCurrentUserShopId();
        if (currentUserShopId.isPresent() && !currentUserShopId.get().equals(shopId)) {
            throw new IllegalArgumentException("Shop Admin can only create cashiers for their own shop");
        }

        if (userRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
            throw new IllegalArgumentException("User with email already exists: " + request.getEmail());
        }

        String keycloakId = keycloakAdapter.createUser(
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                "cashier"
        );

        keycloakAdapter.setUserAttribute(keycloakId, SHOP_ID_ATTRIBUTE, shop.getId().toString());

        User cashier = new User();
        cashier.setTenant(shop.getTenant());
        cashier.setShop(shop);
        cashier.setFirstName(request.getFirstName());
        cashier.setLastName(request.getLastName());
        cashier.setEmail(request.getEmail());
        cashier.setKeycloakId(keycloakId);
        cashier.setActive(true);
        cashier.setDeleted(false);
        cashier = userRepository.save(cashier);

        log.info("Cashier created successfully: {} for shop: {}", cashier.getId(), shop.getId());
        return cashier;
    }

    @Transactional
    public User createStockManager(UUID shopId, CreateStockManagerRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Creating stock manager: {} for shop: {}", request.getEmail(), shopId);

        Shop shop = shopRepository.findByIdAndDeletedFalse(shopId)
                .orElseThrow(() -> new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + shopId));

        if (!shop.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException(SHOP_NOT_FOUND_WITH_ID + shopId);
        }

        var currentUserShopId = userContextService.getCurrentUserShopId();
        if (currentUserShopId.isPresent() && !currentUserShopId.get().equals(shopId)) {
            throw new IllegalArgumentException("Shop Admin can only create stock managers for their own shop");
        }

        if (userRepository.existsByEmailAndDeletedFalse(request.getEmail())) {
            throw new IllegalArgumentException("User with email already exists: " + request.getEmail());
        }

        String keycloakId = keycloakAdapter.createUser(
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                "stock_manager"
        );

        keycloakAdapter.setUserAttribute(keycloakId, SHOP_ID_ATTRIBUTE, shop.getId().toString());

        User stockManager = new User();
        stockManager.setTenant(shop.getTenant());
        stockManager.setShop(shop);
        stockManager.setFirstName(request.getFirstName());
        stockManager.setLastName(request.getLastName());
        stockManager.setEmail(request.getEmail());
        stockManager.setKeycloakId(keycloakId);
        stockManager.setActive(true);
        stockManager.setDeleted(false);
        stockManager = userRepository.save(stockManager);

        log.info("Stock manager created successfully: {} for shop: {}", stockManager.getId(), shop.getId());
        return stockManager;
    }

    private String generateShopCode(String shopName, UUID tenantId) {
        String filtered = shopName.toUpperCase().replaceAll("[^A-Z0-9]", "");
        
        if (filtered.isEmpty()) {
            filtered = "SHOP";
        }
        
        String baseCode = filtered.length() > 10 
                ? filtered.substring(0, 10) 
                : filtered;
        
        String code = baseCode;
        int counter = 1;
        while (shopRepository.existsByTenantIdAndCodeAndDeletedFalse(tenantId, code)) {
            code = baseCode + counter;
            counter++;
            if (counter > 999) {
                code = baseCode + System.currentTimeMillis();
                break;
            }
        }
        return code;
    }
}

