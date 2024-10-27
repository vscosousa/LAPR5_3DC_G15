using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class setDatabasev2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OperationRequests__doctorId",
                table: "OperationRequests");

            migrationBuilder.DropIndex(
                name: "IX_OperationRequests__operationTypeId",
                table: "OperationRequests");

            migrationBuilder.DropIndex(
                name: "IX_OperationRequests__patientId",
                table: "OperationRequests");

            migrationBuilder.CreateIndex(
                name: "IX_OperationRequests__doctorId",
                table: "OperationRequests",
                column: "_doctorId");

            migrationBuilder.CreateIndex(
                name: "IX_OperationRequests__operationTypeId",
                table: "OperationRequests",
                column: "_operationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_OperationRequests__patientId",
                table: "OperationRequests",
                column: "_patientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_OperationRequests__doctorId",
                table: "OperationRequests");

            migrationBuilder.DropIndex(
                name: "IX_OperationRequests__operationTypeId",
                table: "OperationRequests");

            migrationBuilder.DropIndex(
                name: "IX_OperationRequests__patientId",
                table: "OperationRequests");

            migrationBuilder.CreateIndex(
                name: "IX_OperationRequests__doctorId",
                table: "OperationRequests",
                column: "_doctorId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OperationRequests__operationTypeId",
                table: "OperationRequests",
                column: "_operationTypeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OperationRequests__patientId",
                table: "OperationRequests",
                column: "_patientId",
                unique: true);
        }
    }
}
