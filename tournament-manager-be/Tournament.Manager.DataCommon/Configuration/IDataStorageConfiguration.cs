﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.DataCommon.Configuration
{
    public interface IDataStorageConfiguration
    {
        bool IsDataProviderInstalled();
        void InstallDataProvider();
    }
}
