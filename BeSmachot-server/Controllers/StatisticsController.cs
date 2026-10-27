using BeSmachot.Server.Data;
using BeSmachot.Server.DTOs;
using BeSmachot.Server.Extensions;
using BeSmachot.Server.Models;
using BeSmachot.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeSmachot.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/groups/{groupId:guid}/statistics")]
public class StatisticsController(AppDbContext db, IGroupAccessService access) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<StatisticsDto>> Get(Guid groupId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (await access.GetMembershipAsync(userId, groupId, ct) is null) return Forbid();

        var query = db.Brides.AsNoTracking().Where(x => x.GroupId == groupId);
        var total = await query.CountAsync(ct);
        var engaged = await query.CountAsync(x => x.Status == BrideStatus.Engaged, ct);
        var married = await query.CountAsync(x => x.Status == BrideStatus.Married, ct);

        var byYeshiva = await query
            .GroupBy(x => x.Yeshiva)
            .Select(g => new YeshivaCountDto(g.Key, g.Count()))
            .OrderByDescending(x => x.Count)
            .ThenBy(x => x.Yeshiva)
            .ToListAsync(ct);

        return Ok(new StatisticsDto(total, engaged, married, byYeshiva));
    }
}
