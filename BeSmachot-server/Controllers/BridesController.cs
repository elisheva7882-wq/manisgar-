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
[Route("api/groups/{groupId:guid}/brides")]
public class BridesController(AppDbContext db, IGroupAccessService access) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<BrideDto>>> GetAll(Guid groupId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (await access.GetMembershipAsync(userId, groupId, ct) is null) return Forbid();

       var brides = await db.Brides.AsNoTracking()
    .Where(x => x.GroupId == groupId)
    .OrderBy(x => x.ClassName)
    .ThenBy(x => x.BrideLastName)
    .ThenBy(x => x.GroomLastName)
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
        return Ok(brides);
    }

    [HttpGet("{brideId:int}")]
    public async Task<ActionResult<BrideDto>> GetById(Guid groupId, int brideId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (await access.GetMembershipAsync(userId, groupId, ct) is null) return Forbid();

        var bride = await db.Brides.AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == brideId && x.GroupId == groupId, ct);
        return bride is null ? NotFound() : Ok(ToDto(bride));
    }

    [HttpPost]
    public async Task<ActionResult<BrideDto>> Create(Guid groupId, CreateBrideRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.CanAddBrideAsync(userId, groupId, ct)) return Forbid();

        var className = request.ClassName.Trim();
        var specialization = request.Specialization.Trim();

        var classExists = await db.GroupClasses.AnyAsync(
            x => x.GroupId == groupId && x.Name == className, ct);
        if (!classExists)
            return BadRequest(new { message = "The selected class does not exist in this group." });

        var specializationExists = await db.GroupSpecializations.AnyAsync(
            x => x.GroupId == groupId && x.Name == specialization, ct);
        if (!specializationExists)
            return BadRequest(new { message = "The selected specialization does not exist in this group." });
var yeshiva = request.Yeshiva.Trim();

var yeshivaExists = await db.GroupYeshivas.AnyAsync(
    x => x.GroupId == groupId && x.Name == yeshiva,
    ct
);

if (!yeshivaExists)
{
    return BadRequest(new
    {
        message = "The selected yeshiva does not exist in this group."
    });
}
        var bride = new Bride
        {
            GroupId = groupId,
           BrideFirstName = request.BrideFirstName.Trim(),
BrideLastName = request.BrideLastName.Trim(),
GroomFirstName = Clean(request.GroomFirstName),
GroomLastName = request.GroomLastName.Trim(),
            ClassName = className,
            Specialization = specialization,
            Status = request.Status,
            Yeshiva = yeshiva,
            WeddingDate = request.WeddingDate,
            WeddingTime = request.WeddingTime,
            WeddingHall = Clean(request.WeddingHall),
            WeddingCity = Clean(request.WeddingCity),
            CreatedByUserId = userId
        };

        db.Brides.Add(bride);
        await db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { groupId, brideId = bride.Id }, ToDto(bride));
    }

    [HttpPut("{brideId:int}")]
    public async Task<ActionResult<BrideDto>> Update(Guid groupId, int brideId, UpdateBrideRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var bride = await db.Brides.SingleOrDefaultAsync(x => x.Id == brideId && x.GroupId == groupId, ct);
        if (bride is null) return NotFound();

        var className = request.ClassName.Trim();
        var specialization = request.Specialization.Trim();

        if (!await db.GroupClasses.AnyAsync(x => x.GroupId == groupId && x.Name == className, ct))
            return BadRequest(new { message = "The selected class does not exist in this group." });

        if (!await db.GroupSpecializations.AnyAsync(x => x.GroupId == groupId && x.Name == specialization, ct))
            return BadRequest(new { message = "The selected specialization does not exist in this group." });
var yeshiva = request.Yeshiva.Trim();

var yeshivaExists = await db.GroupYeshivas.AnyAsync(
    x => x.GroupId == groupId && x.Name == yeshiva,
    ct
);

if (!yeshivaExists)
{
    return BadRequest(new
    {
        message = "The selected yeshiva does not exist in this group."
    });
}
        bride.BrideFirstName = request.BrideFirstName.Trim();
bride.BrideLastName = request.BrideLastName.Trim();
bride.GroomFirstName = Clean(request.GroomFirstName);
bride.GroomLastName = request.GroomLastName.Trim();
        bride.ClassName = className;
        bride.Specialization = specialization;
        bride.Status = request.Status;
bride.Yeshiva = yeshiva;
        bride.WeddingDate = request.WeddingDate;
        bride.WeddingTime = request.WeddingTime;
        bride.WeddingHall = Clean(request.WeddingHall);
        bride.WeddingCity = Clean(request.WeddingCity);
        bride.UpdatedAtUtc = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return Ok(ToDto(bride));
    }

    [HttpDelete("{brideId:int}")]
    public async Task<IActionResult> Delete(Guid groupId, int brideId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var bride = await db.Brides.SingleOrDefaultAsync(x => x.Id == brideId && x.GroupId == groupId, ct);
        if (bride is null) return NotFound();

        db.Brides.Remove(bride);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPut("{brideId:int}/link-user")]
    public async Task<IActionResult> LinkUser(Guid groupId, int brideId, LinkBrideUserRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var bride = await db.Brides.SingleOrDefaultAsync(x => x.Id == brideId && x.GroupId == groupId, ct);
        if (bride is null) return NotFound();

        var targetMemberExists = await db.GroupMembers.AnyAsync(
            x => x.GroupId == groupId && x.UserId == request.UserId, ct);
        if (!targetMemberExists)
            return BadRequest(new { message = "The selected user is not a member of this group." });

        bride.LinkedUserId = request.UserId;
        bride.UpdatedAtUtc = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpDelete("{brideId:int}/link-user")]
    public async Task<IActionResult> UnlinkUser(Guid groupId, int brideId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var bride = await db.Brides.SingleOrDefaultAsync(x => x.Id == brideId && x.GroupId == groupId, ct);
        if (bride is null) return NotFound();

        bride.LinkedUserId = null;
        bride.UpdatedAtUtc = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return NoContent();
    }
[HttpDelete("{brideId:int}/link-user")]

 private static BrideDto ToDto(Bride x) => new(
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
    x.LinkedUserId);

    private static string? Clean(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
