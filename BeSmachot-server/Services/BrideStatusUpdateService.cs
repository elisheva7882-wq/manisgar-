using BeSmachot.Server.Data;
using BeSmachot.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BeSmachot.Server.Services;

public class BrideStatusUpdateService(
    IServiceScopeFactory scopeFactory,
    ILogger<BrideStatusUpdateService> logger) : BackgroundService
{
    private static readonly TimeZoneInfo IsraelTimeZone =
        TimeZoneInfo.FindSystemTimeZoneById("Asia/Jerusalem");

    public static DateOnly GetToday() =>
        DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, IsraelTimeZone));

    public static BrideStatus GetStatus(BrideStatus status, DateOnly? weddingDate) =>
        status == BrideStatus.Engaged && weddingDate is not null && weddingDate < GetToday()
            ? BrideStatus.Married
            : status;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var today = GetToday();
                var now = DateTime.UtcNow;

                await db.Brides
                    .Where(x => x.Status == BrideStatus.Engaged && x.WeddingDate < today)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(x => x.Status, BrideStatus.Married)
                        .SetProperty(x => x.UpdatedAtUtc, now), stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                logger.LogError(exception, "Failed to update bride statuses.");
            }

            var utcNow = DateTime.UtcNow;
            var nextMidnight = TimeZoneInfo.ConvertTimeFromUtc(utcNow, IsraelTimeZone)
                .Date.AddDays(1);
            var nextRunUtc = TimeZoneInfo.ConvertTimeToUtc(nextMidnight, IsraelTimeZone);

            try
            {
                await Task.Delay(nextRunUtc - utcNow, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
        }
    }
}
