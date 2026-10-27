namespace BeSmachot.Server.Models;

public class GroupYeshiva
{
    public int Id { get; set; }

    public Guid GroupId { get; set; }

    public string Name { get; set; } = string.Empty;

    public Group Group { get; set; } = null!;
}