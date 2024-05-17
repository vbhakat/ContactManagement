namespace ContactsApi.Helpers;

public class InMemoryDatabaseFactory
{
    public static void SeedDefaultData(DataContext context)
    {
        
        context.Database.EnsureCreated();                
    }
}