using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "unit",
                columns: table => new
                {
                    pk_unit = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(type: "TEXT", nullable: false),
                    abbreviation = table.Column<string>(type: "TEXT", nullable: false),
                    register_date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    update_date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    enable = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_unit", x => x.pk_unit);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    pk_user = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(type: "TEXT", nullable: false),
                    lastname = table.Column<string>(type: "TEXT", nullable: false),
                    mail = table.Column<string>(type: "TEXT", nullable: false),
                    password = table.Column<string>(type: "TEXT", nullable: false),
                    role = table.Column<string>(type: "TEXT", nullable: false),
                    register_date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    update_date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    enable = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user", x => x.pk_user);
                });

            migrationBuilder.CreateTable(
                name: "product",
                columns: table => new
                {
                    pk_product = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    serial_number = table.Column<string>(type: "TEXT", nullable: false),
                    name = table.Column<string>(type: "TEXT", nullable: false),
                    price = table.Column<float>(type: "REAL", nullable: false),
                    quantity = table.Column<float>(type: "REAL", nullable: false),
                    min_quantity = table.Column<float>(type: "REAL", nullable: false),
                    min_price = table.Column<float>(type: "REAL", nullable: false),
                    register_date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    update_date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    enable = table.Column<bool>(type: "INTEGER", nullable: true),
                    fk_created_by = table.Column<int>(type: "INTEGER", nullable: true),
                    fk_updated_by = table.Column<int>(type: "INTEGER", nullable: true),
                    fk_unit = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_product", x => x.pk_product);
                    table.ForeignKey(
                        name: "fk_product_unit_fk_unit",
                        column: x => x.fk_unit,
                        principalTable: "unit",
                        principalColumn: "pk_unit");
                    table.ForeignKey(
                        name: "fk_product_user_fk_created_by",
                        column: x => x.fk_created_by,
                        principalTable: "user",
                        principalColumn: "pk_user");
                    table.ForeignKey(
                        name: "fk_product_user_fk_updated_by",
                        column: x => x.fk_updated_by,
                        principalTable: "user",
                        principalColumn: "pk_user");
                });

            migrationBuilder.CreateTable(
                name: "sale",
                columns: table => new
                {
                    pk_sale = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    discount_amount = table.Column<float>(type: "REAL", nullable: false),
                    received_amount = table.Column<float>(type: "REAL", nullable: false),
                    change_amount = table.Column<float>(type: "REAL", nullable: false),
                    subtotal = table.Column<float>(type: "REAL", nullable: false),
                    total = table.Column<float>(type: "REAL", nullable: false),
                    register_date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    update_date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    enable = table.Column<bool>(type: "INTEGER", nullable: false),
                    fk_user = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sale", x => x.pk_sale);
                    table.ForeignKey(
                        name: "fk_sale_user_fk_user",
                        column: x => x.fk_user,
                        principalTable: "user",
                        principalColumn: "pk_user",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sale_detail",
                columns: table => new
                {
                    pk_sale_detail = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    quantity = table.Column<float>(type: "REAL", nullable: false),
                    unit_price = table.Column<float>(type: "REAL", nullable: false),
                    discount = table.Column<float>(type: "REAL", nullable: false),
                    total_product = table.Column<float>(type: "REAL", nullable: false),
                    fk_sale = table.Column<int>(type: "INTEGER", nullable: false),
                    fk_product = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sale_detail", x => x.pk_sale_detail);
                    table.ForeignKey(
                        name: "fk_sale_detail_product_fk_product",
                        column: x => x.fk_product,
                        principalTable: "product",
                        principalColumn: "pk_product",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_sale_detail_sale_fk_sale",
                        column: x => x.fk_sale,
                        principalTable: "sale",
                        principalColumn: "pk_sale",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_product_fk_created_by",
                table: "product",
                column: "fk_created_by");

            migrationBuilder.CreateIndex(
                name: "ix_product_fk_unit",
                table: "product",
                column: "fk_unit");

            migrationBuilder.CreateIndex(
                name: "ix_product_fk_updated_by",
                table: "product",
                column: "fk_updated_by");

            migrationBuilder.CreateIndex(
                name: "ix_sale_fk_user",
                table: "sale",
                column: "fk_user");

            migrationBuilder.CreateIndex(
                name: "ix_sale_detail_fk_product",
                table: "sale_detail",
                column: "fk_product");

            migrationBuilder.CreateIndex(
                name: "ix_sale_detail_fk_sale",
                table: "sale_detail",
                column: "fk_sale");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "sale_detail");

            migrationBuilder.DropTable(
                name: "product");

            migrationBuilder.DropTable(
                name: "sale");

            migrationBuilder.DropTable(
                name: "unit");

            migrationBuilder.DropTable(
                name: "user");
        }
    }
}
