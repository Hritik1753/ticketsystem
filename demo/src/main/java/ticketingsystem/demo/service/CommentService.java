package ticketingsystem.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ticketingsystem.demo.entity.Comment;
import ticketingsystem.demo.repository.CommentRepository;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment addComment(Comment comment) {
         System.out.println("checking for ticket id" + comment);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByTicketId(Long ticketId) {
    
    List<Comment> comments = commentRepository.findByTicketId(ticketId);
    
    // Debug log
    System.out.println("Service: ticketId=" + ticketId + ", found comments=" + comments);
    System.out.println("Total comments fetched: " + comments.size());

    return comments;
}


    public boolean deleteComment(Long id) {
    if (commentRepository.existsById(id)) {
        commentRepository.deleteById(id);
        return true;
    }
    return false;
}

}

