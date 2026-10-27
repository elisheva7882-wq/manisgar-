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
public class GroupStructureController(AppDbContext db, IGroupAccessService access) : ControllerBase
{
    [HttpGet("classes")]
    public async Task<ActionResult<IReadOnlyList<GroupOptionDto>>> GetClasses(Guid groupId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (await access.GetMembershipAsync(userId, groupId, ct) is null) return Forbid();

        var items = await db.GroupClasses.AsNoTracking()
            .Where(x => x.GroupId == groupId)
            .OrderBy(x => x.Name)
            .Select(x => new GroupOptionDto(x.Id, x.Name))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpPost("classes")]
    public async Task<ActionResult<GroupOptionDto>> CreateClass(Guid groupId, CreateGroupOptionRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var name = request.Name.Trim();
        if (await db.GroupClasses.AnyAsync(x => x.GroupId == groupId && x.Name == name, ct))
            return Conflict(new { message = "This class already exists in the group." });

        var item = new GroupClass { GroupId = groupId, Name = name };
        db.GroupClasses.Add(item);
        await db.SaveChangesAsync(ct);

        return Ok(new GroupOptionDto(item.Id, item.Name));
    }

    [HttpDelete("classes/{classId:int}")]
    public async Task<IActionResult> DeleteClass(Guid groupId, int classId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var item = await db.GroupClasses.SingleOrDefaultAsync(x => x.Id == classId && x.GroupId == groupId, ct);
        if (item is null) return NotFound();

        if (await db.Brides.AnyAsync(x => x.GroupId == groupId && x.ClassName == item.Name, ct))
            return Conflict(new { message = "This class is in use by one or more brides." });

        db.GroupClasses.Remove(item);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpGet("specializations")]
    public async Task<ActionResult<IReadOnlyList<GroupOptionDto>>> GetSpecializations(Guid groupId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (await access.GetMembershipAsync(userId, groupId, ct) is null) return Forbid();

        var items = await db.GroupSpecializations.AsNoTracking()
            .Where(x => x.GroupId == groupId)
            .OrderBy(x => x.Name)
            .Select(x => new GroupOptionDto(x.Id, x.Name))
            .ToListAsync(ct);

        return Ok(items);
    }

    [HttpPost("specializations")]
    public async Task<ActionResult<GroupOptionDto>> CreateSpecialization(Guid groupId, CreateGroupOptionRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var name = request.Name.Trim();
        if (await db.GroupSpecializations.AnyAsync(x => x.GroupId == groupId && x.Name == name, ct))
            return Conflict(new { message = "This specialization already exists in the group." });

        var item = new GroupSpecialization { GroupId = groupId, Name = name };
        db.GroupSpecializations.Add(item);
        await db.SaveChangesAsync(ct);

        return Ok(new GroupOptionDto(item.Id, item.Name));
    }

    [HttpDelete("specializations/{specializationId:int}")]
    public async Task<IActionResult> DeleteSpecialization(Guid groupId, int specializationId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var item = await db.GroupSpecializations.SingleOrDefaultAsync(
            x => x.Id == specializationId && x.GroupId == groupId, ct);
        if (item is null) return NotFound();

        if (await db.Brides.AnyAsync(x => x.GroupId == groupId && x.Specialization == item.Name, ct))
            return Conflict(new { message = "This specialization is in use by one or more brides." });

        db.GroupSpecializations.Remove(item);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }
    
    [HttpGet("yeshivas")]
public async Task<ActionResult<IReadOnlyList<GroupOptionDto>>> GetYeshivas(
    Guid groupId,
    CancellationToken ct)
{
    var userId = User.GetUserId();

    if (await access.GetMembershipAsync(userId, groupId, ct) is null)
        return Forbid();

    var yeshivas = await db.GroupYeshivas
        .AsNoTracking()
        .Where(x => x.GroupId == groupId)
        .OrderBy(x => x.Name)
        .Select(x => new GroupOptionDto(
            x.Id,
            x.Name
        ))
        .ToListAsync(ct);

    return Ok(yeshivas);
}

[HttpPost("yeshivas")]
public async Task<ActionResult<GroupOptionDto>> CreateYeshiva(
    Guid groupId,
    CreateGroupOptionRequest request,
    CancellationToken ct)
{
    var userId = User.GetUserId();

    if (!await access.IsAdminAsync(userId, groupId, ct))
        return Forbid();

    var name = request.Name.Trim();

    if (string.IsNullOrWhiteSpace(name))
        return BadRequest(new { message = "Yeshiva name is required." });

    var exists = await db.GroupYeshivas.AnyAsync(
        x => x.GroupId == groupId && x.Name == name,
        ct
    );

    if (exists)
        return Conflict(new
        {
            message = "This yeshiva already exists in the group."
        });

    var item = new GroupYeshiva
    {
        GroupId = groupId,
        Name = name
    };

    db.GroupYeshivas.Add(item);

    await db.SaveChangesAsync(ct);

    return Ok(new GroupOptionDto(
        item.Id,
        item.Name
    ));
}

[HttpDelete("yeshivas/{yeshivaId:int}")]
public async Task<IActionResult> DeleteYeshiva(
    Guid groupId,
    int yeshivaId,
    CancellationToken ct)
{
    var userId = User.GetUserId();

    if (!await access.IsAdminAsync(userId, groupId, ct))
        return Forbid();

    var yeshiva = await db.GroupYeshivas.SingleOrDefaultAsync(
        x => x.Id == yeshivaId && x.GroupId == groupId,
        ct
    );

    if (yeshiva is null)
        return NotFound();

    var isInUse = await db.Brides.AnyAsync(
        x => x.GroupId == groupId &&
             x.Yeshiva == yeshiva.Name,
        ct
    );

    if (isInUse)
    {
        return Conflict(new
        {
            message = "This yeshiva is in use by one or more brides."
        });
    }

    db.GroupYeshivas.Remove(yeshiva);

    await db.SaveChangesAsync(ct);

    return NoContent();
}
 }