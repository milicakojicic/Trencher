﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrenchrRestService.Models
{
    public class VotePost : Post
    {
        public List<VoteOption> VoteOptions { get; set; }
    }
}