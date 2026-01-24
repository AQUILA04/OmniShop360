package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Customer;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.repository.CustomerRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.specification.CustomerSpecification;
import com.omnishop360.backend.web.dto.CreateCustomerRequest;
import com.omnishop360.backend.web.dto.CustomerResponse;
import com.omnishop360.backend.web.dto.CustomerSearchDto;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.UpdateCustomerRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final TenantRepository tenantRepository;
    private final UserContextService userContextService;

    @Transactional
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Creating customer: {} for tenant: {}", request.getEmail(), tenantId);

        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));

        Customer customer = new Customer();
        customer.setTenant(tenant);
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setPostalCode(request.getPostalCode());
        customer.setCountry(request.getCountry());
        customer.setLoyaltyPoints(0);
        customer.setActive(true);
        customer.setDeleted(false);

        customer = customerRepository.save(customer);
        log.info("Customer created successfully: {}", customer.getId());
        return CustomerResponse.from(customer);
    }

    @Transactional
    public CustomerResponse updateCustomer(UUID customerId, UpdateCustomerRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Updating customer: {} for tenant: {}", customerId, tenantId);

        Customer customer = customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + customerId));

        if (request.getFirstName() != null) {
            customer.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            customer.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            customer.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            customer.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            customer.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            customer.setCity(request.getCity());
        }
        if (request.getPostalCode() != null) {
            customer.setPostalCode(request.getPostalCode());
        }
        if (request.getCountry() != null) {
            customer.setCountry(request.getCountry());
        }
        if (request.getActive() != null) {
            customer.setActive(request.getActive());
        }

        customer = customerRepository.save(customer);
        log.info("Customer updated successfully: {}", customer.getId());
        return CustomerResponse.from(customer);
    }

    @Transactional
    public void deleteCustomer(UUID customerId) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Deleting customer: {} for tenant: {}", customerId, tenantId);

        Customer customer = customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + customerId));

        customer.setDeleted(true);
        customerRepository.save(customer);
        log.info("Customer deleted successfully: {}", customerId);
    }

    @Transactional(readOnly = true)
    public PageResponse<CustomerResponse> getCustomers(CustomerSearchDto searchDto, Pageable pageable) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.debug("Fetching customers for tenant: {} with search: {}", tenantId, searchDto);

        Specification<Customer> spec = CustomerSpecification.from(searchDto)
                .and((root, query, cb) -> cb.equal(root.get("tenant").get("id"), tenantId));

        Page<Customer> customers = customerRepository.findAll(spec, pageable);
        Page<CustomerResponse> responsePage = customers.map(CustomerResponse::from);

        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(UUID customerId) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.debug("Fetching customer: {} for tenant: {}", customerId, tenantId);

        Customer customer = customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + customerId));

        return CustomerResponse.from(customer);
    }
}
