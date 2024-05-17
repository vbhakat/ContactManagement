namespace ContactsApi.Helpers;

using Microsoft.EntityFrameworkCore;
using ContactsApi.Entities;

public class DataContext : DbContext
{
    protected readonly IConfiguration Configuration;

    public DataContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // in memory database used for simplicity, change to a real db for production applications
        optionsBuilder.UseInMemoryDatabase("TestDb");
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Contact>().HasData(
            new Contact
                {
                    Id = 1,
                    Name = "Test1",
                    Email = "Test1@email.test",
                    Phone = "111111111",
                    Address="test address"
                },
                new Contact
                {
                    Id = 2,
                    Name = "Test2",
                    Email = "Test2@email.test",
                    Phone = "2222222222",
                    Address="test address 2"
                },
                new Contact
                {
                    Id = 3,
                    Name = "Test3",
                    Email = "Test3@email.test",
                    Phone = "3333333333",
                    Address="test address3"
                },
                new Contact
                {
                    Id = 4,
                    Name = "Test4",
                    Email = "Test4@email.test",
                    Phone = "4444444444",
                    Address="test address4"
                },
                new Contact
                {
                    Id = 5,
                    Name = "Test5",
                    Email = "Test5@email.test",
                    Phone = "5555555555",
                    Address="test address 5"
                },
                new Contact
                {
                    Id = 6,
                    Name = "Test6",
                    Email = "Test6@email.test",
                    Phone = "6666666666",
                    Address="test address6"
                },
                new Contact
                {
                    Id = 7,
                    Name = "Test7",
                    Email = "Test7@email.test",
                    Phone = "7777777777",
                    Address="test address7"
                },
                new Contact
                {
                    Id = 8,
                    Name = "Test8",
                    Email = "Test8@email.test",
                    Phone = "8888888888",
                    Address="test address 8"
                },
                new Contact
                {
                    Id = 9,
                    Name = "Test9",
                    Email = "Test9@email.test",
                    Phone = "9999999999",
                    Address="test address 9"
                },
                new Contact
                {
                    Id = 10,
                    Name = "Test10",
                    Email = "Test10@email.test",
                    Phone = "1000000000",
                    Address="test address 10"
                }            

        );
    }
  public DbSet<Contact> Contacts { get; set; }
}