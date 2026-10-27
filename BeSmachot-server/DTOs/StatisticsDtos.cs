namespace BeSmachot.Server.DTOs;

public record YeshivaCountDto(string Yeshiva, int Count);

public record StatisticsDto(
    int Total,
    int Engaged,
    int Married,
    IReadOnlyList<YeshivaCountDto> ByYeshiva);
