using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace TrenchrRestService.Hubs
{
    public class NotificationHub : Hub
    {
        public static int NotificationCount { get; set; }
        public static int MessageCount { get; set; }
    }
}