using BeSmachot.Server.Data;
using BeSmachot.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BeSmachot.Server.Services;

public class GroupAccessService(AppDbContext db) : IGroupAccessService
{
    public Task<GroupMember?> GetMembershipAsync(Guid userId, Guid groupId, CancellationToken cancellationToken = default) =>
        db.GroupMembers.AsNoTracking()
            .SingleOrDefaultAsync(x => x.UserId == userId && x.GroupId == groupId, cancellationToken);

    public async Task<bool> CanAddBrideAsync(Guid userId, Guid groupId, CancellationToken cancellationToken = default)
    {
        var membership = await GetMembershipAsync(userId, groupId, cancellationToken);
        return membership?.Role is GroupRole.Contributor or GroupRole.Admin;
    }

    public async Task<bool> IsAdminAsync(Guid userId, Guid groupId, CancellationToken cancellationToken = default)
    {
        var membership = await GetMembershipAsync(userId, groupId, cancellationToken);
        return membership?.Role == GroupRole.Admin;
    }
}
