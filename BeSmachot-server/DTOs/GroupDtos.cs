using System.ComponentModel.DataAnnotations;
using BeSmachot.Server.Models;

namespace BeSmachot.Server.DTOs;

public record CreateGroupRequest([Required, MaxLength(120)] string Name);
public record JoinGroupRequest([Required] string JoinCode);
public record ChangeMemberRoleRequest(GroupRole Role);
public record LinkBrideUserRequest(Guid UserId);

public record GroupSummaryDto(Guid Id, string Name, string JoinCode, GroupRole Role);
public record MemberDto(Guid UserId, string FullName, string Email, GroupRole Role, DateTime JoinedAtUtc);
