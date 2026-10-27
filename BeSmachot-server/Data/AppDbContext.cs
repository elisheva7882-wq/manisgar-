using BeSmachot.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BeSmachot.Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<GroupMember> GroupMembers => Set<GroupMember>();
    public DbSet<Bride> Brides => Set<Bride>();
    public DbSet<GroupClass> GroupClasses => Set<GroupClass>();
    public DbSet<GroupSpecialization> GroupSpecializations => Set<GroupSpecialization>();
    public DbSet<Blessing> Blessings => Set<Blessing>();
public DbSet<GroupYeshiva> GroupYeshivas => Set<GroupYeshiva>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.Email).HasMaxLength(320);
            entity.Property(x => x.FullName).HasMaxLength(120);
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasIndex(x => x.JoinCode).IsUnique();
            entity.Property(x => x.Name).HasMaxLength(120);
            entity.Property(x => x.JoinCode).HasMaxLength(12);
        });


        modelBuilder.Entity<GroupClass>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(80);
            entity.HasIndex(x => new { x.GroupId, x.Name }).IsUnique();

            entity.HasOne(x => x.Group)
                .WithMany(x => x.Classes)
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<GroupSpecialization>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(100);
            entity.HasIndex(x => new { x.GroupId, x.Name }).IsUnique();

            entity.HasOne(x => x.Group)
                .WithMany(x => x.Specializations)
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<GroupMember>(entity =>
        {
            entity.HasKey(x => new { x.GroupId, x.UserId });
            entity.Property(x => x.Role).HasConversion<string>().HasMaxLength(20);

            entity.HasOne(x => x.Group)
                .WithMany(x => x.Members)
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.User)
                .WithMany(x => x.GroupMemberships)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<GroupYeshiva>()
    .HasIndex(x => new { x.GroupId, x.Name })
    .IsUnique();

        modelBuilder.Entity<Bride>(entity =>
        {
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            entity.Property(x => x.BrideFirstName).HasMaxLength(60);
entity.Property(x => x.BrideLastName).HasMaxLength(60);
entity.Property(x => x.GroomFirstName).HasMaxLength(60);
entity.Property(x => x.GroomLastName).HasMaxLength(60);
            entity.Property(x => x.ClassName).HasMaxLength(80);
            entity.Property(x => x.Specialization).HasMaxLength(100);
            entity.Property(x => x.Yeshiva).HasMaxLength(150);
            entity.Property(x => x.WeddingHall).HasMaxLength(150);
            entity.Property(x => x.WeddingCity).HasMaxLength(100);

            entity.HasOne(x => x.Group)
                .WithMany(x => x.Brides)
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.LinkedUser)
                .WithMany()
                .HasForeignKey(x => x.LinkedUserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(x => x.CreatedByUser)
                .WithMany()
                .HasForeignKey(x => x.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Blessing>(entity =>
        {
            entity.Property(x => x.Content).HasMaxLength(3000);

            entity.HasOne(x => x.Bride)
                .WithMany(x => x.Blessings)
                .HasForeignKey(x => x.BrideId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.SenderUser)
                .WithMany(x => x.SentBlessings)
                .HasForeignKey(x => x.SenderUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
