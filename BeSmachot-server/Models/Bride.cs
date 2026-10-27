namespace BeSmachot.Server.Models;

public class Bride
{
    public int Id { get; set; }

    public Guid GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public string BrideFirstName { get; set; } = string.Empty;

public string BrideLastName { get; set; } = string.Empty;

public string? GroomFirstName { get; set; }

public string GroomLastName { get; set; } = string.Empty;
    public required string ClassName { get; set; }
    public required string Specialization { get; set; }
    public BrideStatus Status { get; set; }
    public required string Yeshiva { get; set; }

    public DateOnly? WeddingDate { get; set; }
    public TimeOnly? WeddingTime { get; set; }
    public string? WeddingHall { get; set; }
    public string? WeddingCity { get; set; }

    public Guid? LinkedUserId { get; set; }
    public AppUser? LinkedUser { get; set; }

    public Guid CreatedByUserId { get; set; }
    public AppUser CreatedByUser { get; set; } = null!;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<Blessing> Blessings { get; set; } = new List<Blessing>();
}
