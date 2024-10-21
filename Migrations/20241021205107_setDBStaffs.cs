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

            migrationBuilder.AlterColumn<string>(
                name: "SpecOption",
                table: "Specializations",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Users__staffId",
                table: "Users",
                column: "_staffId",
                unique: true,
                filter: "[_staffId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Specializations_SpecOption",
                table: "Specializations",
                column: "SpecOption",
                unique: true);

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

            migrationBuilder.DropIndex(
                name: "IX_Specializations_SpecOption",
                table: "Specializations");

            migrationBuilder.DropColumn(
                name: "_staffId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Staffs");

            migrationBuilder.AlterColumn<string>(
                name: "SpecOption",
                table: "Specializations",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
