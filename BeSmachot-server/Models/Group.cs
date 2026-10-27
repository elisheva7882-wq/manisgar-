namespace BeSmachot.Server.Models;

public class Group
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string JoinCode { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
    public ICollection<Bride> Brides { get; set; } = new List<Bride>();
    public ICollection<GroupClass> Classes { get; set; } = new List<GroupClass>();
    public ICollection<GroupSpecialization> Specializations { get; set; } = new List<GroupSpecialization>();
public ICollection<GroupYeshiva> Yeshivas { get; set; } = new List<GroupYeshiva>();
}
