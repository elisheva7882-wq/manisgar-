namespace BeSmachot.Server.Models;

public class GroupClass
{
    public int Id { get; set; }

    public Guid GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public required string Name { get; set; }
}
