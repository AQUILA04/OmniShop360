package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private UUID id;
    private String name;
    private String code;
    private String description;
    private UUID parentId;
    private String parentName;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CategoryResponse from(Category category) {
        if (category == null) {
            return null;
        }

        CategoryResponse.CategoryResponseBuilder builder = CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .code(category.getCode())
                .description(category.getDescription())
                .active(category.getActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt());

        if (category.getParent() != null) {
            builder.parentId(category.getParent().getId())
                   .parentName(category.getParent().getName());
        }

        return builder.build();
    }
}

