using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeSmachot.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBrideNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Brides");

            migrationBuilder.AddColumn<string>(
                name: "BrideFirstName",
                table: "Brides",
                type: "character varying(60)",
                maxLength: 60,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BrideLastName",
                table: "Brides",
                type: "character varying(60)",
                maxLength: 60,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GroomFirstName",
                table: "Brides",
                type: "character varying(60)",
                maxLength: 60,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroomLastName",
                table: "Brides",
                type: "character varying(60)",
                maxLength: 60,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BrideFirstName",
                table: "Brides");

            migrationBuilder.DropColumn(
                name: "BrideLastName",
                table: "Brides");

            migrationBuilder.DropColumn(
                name: "GroomFirstName",
                table: "Brides");

            migrationBuilder.DropColumn(
                name: "GroomLastName",
                table: "Brides");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Brides",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");
        }
    }
}
