namespace BeSmachot.Server.Models;

public class GroupMember
{
    public Guid GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public GroupRole Role { get; set; } = GroupRole.Member;
    public DateTime JoinedAtUtc { get; set; } = DateTime.UtcNow;
}
