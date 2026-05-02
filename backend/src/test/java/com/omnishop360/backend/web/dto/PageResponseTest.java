package com.omnishop360.backend.web.dto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("PageResponse Tests")
class PageResponseTest {

    @Test
    @DisplayName("Should create PageResponse from Spring Data Page")
    void shouldCreatePageResponseFromSpringDataPage() {
        List<String> content = List.of("Item 1", "Item 2", "Item 3");
        PageRequest pageable = PageRequest.of(0, 10);
        Page<String> page = new PageImpl<>(content, pageable, 25);

        PageResponse<String> response = PageResponse.from(page);

        assertNotNull(response);
        assertNotNull(response.getContent());
        assertEquals(3, response.getContent().size());
        assertEquals("Item 1", response.getContent().get(0));
        
        assertNotNull(response.getPage());
        assertEquals(10, response.getPage().getSize());
        assertEquals(0, response.getPage().getNumber());
        assertEquals(25L, response.getPage().getTotalElements());
        assertEquals(3, response.getPage().getTotalPages());
    }

    @Test
    @DisplayName("Should handle empty page")
    void shouldHandleEmptyPage() {
        PageRequest pageable = PageRequest.of(0, 10);
        Page<String> page = new PageImpl<>(List.of(), pageable, 0);

        PageResponse<String> response = PageResponse.from(page);

        assertNotNull(response);
        assertNotNull(response.getContent());
        assertTrue(response.getContent().isEmpty());
        assertEquals(0, response.getPage().getTotalElements());
        assertEquals(0, response.getPage().getTotalPages());
    }

    @Test
    @DisplayName("Should handle page with single element")
    void shouldHandlePageWithSingleElement() {
        List<String> content = List.of("Single Item");
        PageRequest pageable = PageRequest.of(0, 10);
        Page<String> page = new PageImpl<>(content, pageable, 1);

        PageResponse<String> response = PageResponse.from(page);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(1L, response.getPage().getTotalElements());
        assertEquals(1, response.getPage().getTotalPages());
    }
}

