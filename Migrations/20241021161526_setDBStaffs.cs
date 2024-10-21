using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class setDBStaffs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "_staffId",
                table: "Users",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Staffs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Users__staffId",
                table: "Users",
                column: "_staffId",
                unique: true,
                filter: "[_staffId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Staffs__staffId",
                table: "Users",
                column: "_staffId",
                principalTable: "Staffs",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Staffs__staffId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users__staffId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "_staffId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Staffs");
        }
    }
}
