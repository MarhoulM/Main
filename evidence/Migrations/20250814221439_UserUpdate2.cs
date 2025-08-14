using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Evidence.Migrations
{
    /// <inheritdoc />
    public partial class UserUpdate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Adminn",
                table: "Users",
                newName: "Admin");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Admin",
                table: "Users",
                newName: "Adminn");
        }
    }
}
