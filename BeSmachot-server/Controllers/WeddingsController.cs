using BeSmachot.Server.Data;
using BeSmachot.Server.DTOs;
using BeSmachot.Server.Extensions;
using BeSmachot.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeSmachot.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/groups/{groupId:guid}/weddings")]
public class WeddingsController(AppDbContext db, IGroupAccessService access) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<BrideDto>>> GetRange(
        Guid groupId,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to,
        CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (await access.GetMembershipAsync(userId, groupId, ct) is null) return Forbid();

        var query = db.Brides.AsNoTracking()
            .Where(x => x.GroupId == groupId && x.WeddingDate != null);

        if (from is not null) query = query.Where(x => x.WeddingDate >= from);
        if (to is not null) query = query.Where(x => x.WeddingDate <= to);

        var weddings = await query
            .OrderBy(x => x.WeddingDate)
            .ThenBy(x => x.WeddingTime)
            .Select(x => new BrideDto(
                x.Id,
                x.BrideFirstName,
                x.BrideLastName,
                x.GroomFirstName,
                x.GroomLastName,
                x.ClassName,
                x.Specialization,
                x.Status,
                x.Yeshiva,
                x.WeddingDate,
                x.WeddingTime,
                x.WeddingHall,
                x.WeddingCity,
                x.LinkedUserId))
            .ToListAsync(ct);

        return Ok(weddings);
    }

    [HttpGet("today")]
    public async Task<ActionResult<IReadOnlyList<BrideDto>>> GetToday(
        Guid groupId,
        [FromQuery] DateOnly? date,
        CancellationToken ct)
    {
        if (date is null)
            return BadRequest(new { message = "Send the user's local date as ?date=YYYY-MM-DD." });

        return await GetRange(groupId, date, date, ct);
    }
}