namespace BeSmachot.Server.Models;

public class Blessing
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public int BrideId { get; set; }
    public Bride Bride { get; set; } = null!;

    public Guid SenderUserId { get; set; }
    public AppUser SenderUser { get; set; } = null!;

    public required string Content { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
