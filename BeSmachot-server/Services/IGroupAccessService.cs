using BeSmachot.Server.Models;

namespace BeSmachot.Server.Services;

public interface IGroupAccessService
{
    Task<GroupMember?> GetMembershipAsync(Guid userId, Guid groupId, CancellationToken cancellationToken = default);
    Task<bool> CanAddBrideAsync(Guid userId, Guid groupId, CancellationToken cancellationToken = default);
    Task<bool> IsAdminAsync(Guid userId, Guid groupId, CancellationToken cancellationToken = default);
}
