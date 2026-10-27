using System.ComponentModel.DataAnnotations;

namespace BeSmachot.Server.DTOs;

public record CreateBlessingRequest(
    [Required, MinLength(1), MaxLength(3000)] string Content);

public record BlessingDto(
    Guid Id,
    int BrideId,
    string BrideName,
    string SenderName,
    string Content,
    DateTime CreatedAtUtc);
