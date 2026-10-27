using System.Security.Cryptography;
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
[Route("api/groups")]
public class GroupsController(AppDbContext db, IGroupAccessService access) : ControllerBase
{
    private const string JoinCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<GroupSummaryDto>>> GetMyGroups(CancellationToken ct)
    {
        var userId = User.GetUserId();
        var groups = await db.GroupMembers.AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Group.Name)
            .Select(x => new GroupSummaryDto(x.GroupId, x.Group.Name, x.Group.JoinCode, x.Role))
            .ToListAsync(ct);
        return Ok(groups);
    }

    [HttpPost]
    public async Task<ActionResult<GroupSummaryDto>> Create(CreateGroupRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        var joinCode = await GenerateUniqueJoinCodeAsync(ct);

        var group = new Group { Name = request.Name.Trim(), JoinCode = joinCode };
        group.Members.Add(new GroupMember { UserId = userId, Role = GroupRole.Admin });

var defaultYeshivas = new[]
{
    "אדרת אליהו",
    "אהל יעקב",
    "אופקים",
    "אור ישראל",
    "אורחות תורה",
    "אטינגר (כנסת יחזקאל)",
    "אש התלמוד",
    "באר התלמוד",
    "בויאר",
    "בית מאיר",
    "בית מדרש עליון",
    "בית מתתיהו",
    "בית שמעיה",
    "בני יששכר",
    "בריסק",
    "ברכת אפרים",
    "גאון יעקב",
    "גרודנא באר יעקב",
    "דרך אמונה",
    "הרב וולבה",
    "וולפסון",
    "זכרון מיכאל",
    "חברון",
    "חדרה",
    "חמד",
    "טלזסטון (מאורות התורה)",
    "טשעיבין",
    "יד אהרון",
    "יסודות",
    "יסודות (לב)",
    "ירוחם",
    "כנסת יצחק חדרה ק\"ס",
    "כרמיאל - רינה של תורה",
    "כתר תורה",
    "ליקווד",
    "לנדא",
    "מאור התלמוד",
    "מהריל",
    "מיר",
    "מיר ברכפלד",
    "מן ההר",
    "משכן אשר",
    "משכנות אברהם",
    "משכנות התורה",
    "נזר יהושע",
    "נחלת הלויים",
    "נחלת עפולה",
    "נר זרח- עוצם",
    "סלבודקא",
    "עטרת ישראל",
    "עטרת שלמה (סורוצקין)",
    "פונוביז",
    "פינקל",
    "קול יעקב",
    "קול תורה",
    "קמניץ",
    "קפלן",
    "קפלן החדשה-קפל\"ח",
    "קרית מלך",
    "רכסים",
    "שכר שכיר",
    "שערי שמועות",
    "שערי תבונה",
    "תורה בתפארתה",
    "תורת זאב- סולובייצ'יק",
    "תורת משה (ליזרוק)",
    "תפרח",
    "תפרח -גריינימן"
};

var defaultSpecializations = new[]
{
    "תכנות- בינה",
    "תכנות- שבבים",
    "תכנות - פולסטאק",
    "תקשוב-Devops",
    "ראיית חשבון",
    "יעוץ מס",
    "יעוץ מס + הוראה",
    "הוראה מתקנת",
    "הוראת מתמטיקה",
    "גננות",
    "אדריכלות ",
    "הוראת אנגלית",
    "ניתוח התנהגות",
    "התעמלות",
    "חינוך מיוחד",
    "חשבונאות מתקדמת",
    "ניהול עסקי+ הוראה",
    "הוראת עברית",
    "הוראה ישומי מחשב ויסודי",
    "אחר"
};


    foreach (var specialization in defaultSpecializations)
    {
        group.Specializations.Add(new GroupSpecialization
        {
            Name = specialization
        });
    }

    foreach (var yeshiva in defaultYeshivas)
    {
        group.Yeshivas.Add(new GroupYeshiva
        {
            Name = yeshiva
        });
    }


        db.Groups.Add(group);
        await db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetById), new { groupId = group.Id },
            new GroupSummaryDto(group.Id, group.Name, group.JoinCode, GroupRole.Admin));
    }

    [HttpPost("join")]
    public async Task<ActionResult<GroupSummaryDto>> Join(JoinGroupRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        var code = request.JoinCode.Trim().ToUpperInvariant();
        var group = await db.Groups.SingleOrDefaultAsync(x => x.JoinCode == code, ct);
        if (group is null) return NotFound(new { message = "Group code was not found." });

        var existing = await db.GroupMembers.FindAsync([group.Id, userId], ct);
        if (existing is not null)
            return Ok(new GroupSummaryDto(group.Id, group.Name, group.JoinCode, existing.Role));

        db.GroupMembers.Add(new GroupMember
        {
            GroupId = group.Id,
            UserId = userId,
            Role = GroupRole.Member
        });
        await db.SaveChangesAsync(ct);

        return Ok(new GroupSummaryDto(group.Id, group.Name, group.JoinCode, GroupRole.Member));
    }

    [HttpGet("{groupId:guid}")]
    public async Task<ActionResult<GroupSummaryDto>> GetById(Guid groupId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        var membership = await access.GetMembershipAsync(userId, groupId, ct);
        if (membership is null) return Forbid();

        var group = await db.Groups.AsNoTracking().SingleOrDefaultAsync(x => x.Id == groupId, ct);
        return group is null
            ? NotFound()
            : Ok(new GroupSummaryDto(group.Id, group.Name, group.JoinCode, membership.Role));
    }

    [HttpGet("{groupId:guid}/members")]
    public async Task<ActionResult<IReadOnlyList<MemberDto>>> GetMembers(Guid groupId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var members = await db.GroupMembers.AsNoTracking()
            .Where(x => x.GroupId == groupId)
            .OrderBy(x => x.User.FullName)
            .Select(x => new MemberDto(x.UserId, x.User.FullName, x.User.Email, x.Role, x.JoinedAtUtc))
            .ToListAsync(ct);
        return Ok(members);
    }

    [HttpPut("{groupId:guid}/members/{memberUserId:guid}/role")]
    public async Task<IActionResult> ChangeRole(Guid groupId, Guid memberUserId, ChangeMemberRoleRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();
        if (memberUserId == userId && request.Role != GroupRole.Admin)
            return BadRequest(new { message = "You cannot remove your own admin role." });

        var membership = await db.GroupMembers.SingleOrDefaultAsync(
            x => x.GroupId == groupId && x.UserId == memberUserId, ct);
        if (membership is null) return NotFound();

        membership.Role = request.Role;
        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPost("{groupId:guid}/join-code/rotate")]
    public async Task<ActionResult<object>> RotateJoinCode(Guid groupId, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (!await access.IsAdminAsync(userId, groupId, ct)) return Forbid();

        var group = await db.Groups.SingleOrDefaultAsync(x => x.Id == groupId, ct);
        if (group is null) return NotFound();

        group.JoinCode = await GenerateUniqueJoinCodeAsync(ct);
        await db.SaveChangesAsync(ct);
        return Ok(new { group.JoinCode });
    }

    private async Task<string> GenerateUniqueJoinCodeAsync(CancellationToken ct)
    {
        while (true)
        {
            var chars = new char[8];
            for (var i = 0; i < chars.Length; i++)
                chars[i] = JoinCodeAlphabet[RandomNumberGenerator.GetInt32(JoinCodeAlphabet.Length)];

            var code = new string(chars);
            if (!await db.Groups.AnyAsync(x => x.JoinCode == code, ct)) return code;
        }
    }
    [HttpDelete("{groupId:guid}")]
public async Task<IActionResult> DeleteGroup(
    Guid groupId,
    CancellationToken ct)
{
    var userId = User.GetUserId();

    var isAdmin = await access.IsAdminAsync(
        userId,
        groupId,
        ct
    );

    if (!isAdmin)
        return Forbid();

    var group = await db.Groups
        .SingleOrDefaultAsync(
            g => g.Id == groupId,
            ct
        );

    if (group is null)
        return NotFound();

    db.Groups.Remove(group);

    await db.SaveChangesAsync(ct);

    return NoContent();
}
[HttpDelete("{groupId:guid}/leave")]
public async Task<IActionResult> LeaveGroup(
    Guid groupId,
    CancellationToken ct)
{
    var userId = User.GetUserId();

    var membership = await db.GroupMembers
        .SingleOrDefaultAsync(
            x => x.GroupId == groupId &&
                 x.UserId == userId,
            ct
        );

    if (membership is null)
        return NotFound();

    if (membership.Role == GroupRole.Admin)
    {
        return BadRequest(new
        {
            message = "Admin cannot leave the group."
        });
    }

    db.GroupMembers.Remove(membership);

    await db.SaveChangesAsync(ct);

    return NoContent();
}
}
