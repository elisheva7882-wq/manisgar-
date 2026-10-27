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
[Route("api/groups/{groupId:guid}")]
public class BlessingsController(AppDbContext db, IGroupAccessService access) : ControllerBase
{
    [HttpPost("brides/{brideId:int}/blessings")]
    public async Task<ActionResult> Create(Guid groupId, int brideId, CreateBlessingRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (await access.GetMembershipAsync(userId, groupId, ct) is null) return Forbid();

        if (string.IsNullOrWhiteSpace(request.Content))
            return BadRequest(new { message = "Blessing cannot be empty." });

        var brideExists = await db.Brides.AnyAsync(x => x.Id == brideId && x.GroupId == groupId, ct);
        if (!brideExists) return NotFound();

        var blessing = new Blessing
        {
            BrideId = brideId,
            SenderUserId = userId,
            Content = request.Content.Trim()
        };

        db.Blessings.Add(blessing);
        await db.SaveChangesAsync(ct);
        return Created(string.Empty, new { blessing.Id });
    }

    [HttpGet("blessings/mine")]
    public async Task<ActionResult<IReadOnlyList<BlessingDto>>> GetMine(Guid groupId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (await access.GetMembershipAsync(userId, groupId, ct) is null) return Forbid();

        var blessings = await db.Blessings.AsNoTracking()
            .Where(x => x.Bride.GroupId == groupId && x.Bride.LinkedUserId == userId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new BlessingDto(
                x.Id,
                x.BrideId,
                x.Bride.BrideLastName + " - " + x.Bride.GroomLastName,
                x.SenderUser.FullName,
                x.Content,
                x.CreatedAtUtc))
            .ToListAsync(ct);

        return Ok(blessings);
    }
}
