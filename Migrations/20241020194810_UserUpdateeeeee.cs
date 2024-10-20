using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class UserUpdateeeeee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "_patientId",
                table: "Users",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users__patientId",
                table: "Users",
                column: "_patientId",
                unique: true,
                filter: "[_patientId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Patients__patientId",
                table: "Users",
                column: "_patientId",
                principalTable: "Patients",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Patients__patientId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users__patientId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "_patientId",
                table: "Users");
        }
    }
}
