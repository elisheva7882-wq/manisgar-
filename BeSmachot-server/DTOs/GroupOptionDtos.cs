using System.ComponentModel.DataAnnotations;

namespace BeSmachot.Server.DTOs;

public record CreateGroupOptionRequest(
    [Required, MaxLength(100)] string Name);

public record GroupOptionDto(int Id, string Name);
