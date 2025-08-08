package ticketingsystem.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ticketingsystem.demo.entity.Comment;
import java.util.List;
import jakarta.transaction.Transactional;
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketId(Long ticketId);
     @Modifying
    @Transactional
    @Query("DELETE FROM Comment c WHERE c.ticketId = :ticketId")
    void deleteByTicketId(@Param("ticketId") Long ticketId);
}

