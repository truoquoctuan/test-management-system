package com.bigbird.tmsrepo.service.Impl;

import com.bigbird.tmsrepo.cmmn.base.PageInfo;
import com.bigbird.tmsrepo.cmmn.exception.ResourceNotFoundException;
import com.bigbird.tmsrepo.dto.PositionDTO;
import com.bigbird.tmsrepo.dto.PositionPage;
import com.bigbird.tmsrepo.entity.Position;
import com.bigbird.tmsrepo.repository.PositionRepository;
import com.bigbird.tmsrepo.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {
    private final PositionRepository positionRepository;
    private final ModelMapper modelMapper;

    @Override
    public PositionPage getAllPosition(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Position> positions = positionRepository.getALlPosition(pageable);
            PageInfo pageInfo = new PageInfo(positions.getTotalPages(), (int) positions.getTotalElements(), positions.getNumber(), positions.getSize());
            return new PositionPage(positions.getContent(), pageInfo);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Position service", "Position page", page + size);
        }
    }

    @Override
    public PositionDTO savePosition(PositionDTO positionDTO) {
        try {
            Long id = positionDTO.getPositionId();
            if (id != null) {
                Position old = positionRepository.findById(id).get();
                positionDTO.setCreatedAt(old.getCreatedAt());
                positionDTO.setUpdatedAt(LocalDateTime.now());
            } else {
                positionDTO.setCreatedAt(LocalDateTime.now());
            }
            Position position = modelMapper.map(positionDTO, Position.class);
            position = positionRepository.save(position);
            return modelMapper.map(position, PositionDTO.class);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Save position", positionDTO);
        }
    }

    @Override
    public void deletePositions(List<Long> ids) {
        ids.forEach(x -> {
            if (positionRepository.existsById(x)) {
                positionRepository.deleteById(x);
            }
        });
    }
}
