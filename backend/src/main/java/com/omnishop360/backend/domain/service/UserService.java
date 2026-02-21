package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.domain.repository.UserRepository;
import com.omnishop360.backend.domain.repository.specification.UserSpecification;
import com.omnishop360.backend.infrastructure.adapter.KeycloakAdapter;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.UserResponse;
import com.omnishop360.backend.web.dto.UserSearchDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private static final Set<String> BUSINESS_ROLES = Set.of(
            "superadmin", "tenant_admin", "shop_admin", "cashier", "stock_manager");

    private final UserRepository userRepository;
    private final UserContextService userContextService;
    private final KeycloakAdapter keycloakAdapter;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsers(UserSearchDto searchDto, Pageable pageable) {
        log.debug("Fetching users with search: {}", searchDto);

        Specification<User> spec = UserSpecification.from(searchDto);

        if (!SecurityUtils.isSuperAdmin()) {
            UUID tenantId = userContextService.getCurrentUserTenantId();
            spec = spec.and((root, query, cb) -> cb.equal(root.get("tenant").get("id"), tenantId));
        }

        Page<User> users = userRepository.findAll(spec, pageable);
        Page<UserResponse> responsePage = users.map(user -> {
            List<String> roleNames = keycloakAdapter.getRealmRoleNames(user.getKeycloakId());
            List<String> businessRoles = roleNames != null
                    ? roleNames.stream().filter(BUSINESS_ROLES::contains).toList()
                    : List.of();
            String role = businessRoles.isEmpty() ? null : String.join(", ", businessRoles);
            return UserResponse.from(user, role);
        });

        return PageResponse.from(responsePage);
    }
}
