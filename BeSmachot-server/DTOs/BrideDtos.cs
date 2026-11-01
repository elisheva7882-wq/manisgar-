using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using BeSmachot.Server.Models;
using BeSmachot.Server.Serialization;

namespace BeSmachot.Server.DTOs;

public record CreateBrideRequest(
    [Required, MaxLength(60)] string BrideFirstName,
    [Required, MaxLength(60)] string BrideLastName,
    [MaxLength(60)] string? GroomFirstName,
    [Required, MaxLength(60)] string GroomLastName,
    [Required, MaxLength(80)] string ClassName,
    [Required, MaxLength(100)] string Specialization,
    BrideStatus Status,
    [Required, MaxLength(150)] string Yeshiva,
    [property: JsonConverter(typeof(EmptyStringNullableJsonConverter<DateOnly>))] DateOnly? WeddingDate,
    [property: JsonConverter(typeof(EmptyStringNullableJsonConverter<TimeOnly>))] TimeOnly? WeddingTime,
    [MaxLength(150)] string? WeddingHall,
    [MaxLength(100)] string? WeddingCity);

public record UpdateBrideRequest(
    [Required, MaxLength(60)] string BrideFirstName,
    [Required, MaxLength(60)] string BrideLastName,
    [MaxLength(60)] string? GroomFirstName,
    [Required, MaxLength(60)] string GroomLastName,
    [Required, MaxLength(80)] string ClassName,
    [Required, MaxLength(100)] string Specialization,
    BrideStatus Status,
    [Required, MaxLength(150)] string Yeshiva,
    [property: JsonConverter(typeof(EmptyStringNullableJsonConverter<DateOnly>))] DateOnly? WeddingDate,
    [property: JsonConverter(typeof(EmptyStringNullableJsonConverter<TimeOnly>))] TimeOnly? WeddingTime,
    [MaxLength(150)] string? WeddingHall,
    [MaxLength(100)] string? WeddingCity);

public record BrideDto(
    int Id,
    string BrideFirstName,
    string BrideLastName,
    string? GroomFirstName,
    string GroomLastName,
    string ClassName,
    string Specialization,
    BrideStatus Status,
    string Yeshiva,
    DateOnly? WeddingDate,
    TimeOnly? WeddingTime,
    string? WeddingHall,
    string? WeddingCity,
    Guid? LinkedUserId);
