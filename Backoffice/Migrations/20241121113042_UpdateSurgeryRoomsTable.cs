﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSurgeryRoomsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppointmentDates",
                table: "SurgeryRooms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppointmentDates",
                table: "SurgeryRooms");
        }
    }
}
