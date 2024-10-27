using System;
using System.Net.Http;
using System.Threading.Tasks;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using Microsoft.Extensions.Configuration;

namespace DDDSample1.Infrastructure.PlanningModule
{
    public class PlanningModuleNotifier : IPlanningModuleNotifier
    {
        private readonly HttpClient _httpClient;
        private readonly string _planningModuleUrl;

        public PlanningModuleNotifier(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _planningModuleUrl = configuration["PlanningModuleUrl"];
        }

        public Task NotifyOperationRequestCancelledAsync(OperationRequest request)
        {
            throw new NotImplementedException();
        }

        public Task NotifyOperationRequestCreatedAsync(OperationRequest request)
        {
            throw new NotImplementedException();
        }

        public async Task NotifyOperationRequestDeleted(string operationRequestId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync(
                    $"{_planningModuleUrl}/api/planning/operations/{operationRequestId}");
                
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                // Log the error but don't throw - we don't want to fail the deletion if notification fails
                Console.WriteLine($"Failed to notify planning module: {ex.Message}");
            }
        }

        public Task NotifyOperationRequestUpdateAsync(OperationRequest request)
        {
            throw new NotImplementedException();
        }
    }
}