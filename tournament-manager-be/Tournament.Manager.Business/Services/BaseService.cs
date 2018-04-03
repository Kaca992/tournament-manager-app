using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Services
{
    public abstract class BaseService : IDisposable
    {
        public Entities DbContext { get; private set; }
        protected BaseService()
        {
            DbContext = DbContextFactory.Context;
            disposeContext = true;
        }

        protected BaseService(Entities dbContext)
        {
            DbContext = dbContext;
            disposeContext = false;
        }

        public void SaveChanges()
        {
            DbContext.SaveChanges();
        }

        public async Task SaveChangesAsync()
        {
            await DbContext.SaveChangesAsync();
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        // only the service that opened the context should close it
        private bool disposeContext = true;
        protected virtual void Dispose(bool disposing)
        {
            Debug.WriteLine($"Disposing :{disposing} of object {this.GetType()}");
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                    if (DbContext != null)
                    {
                        DbContext.Dispose();
                    }
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~BaseService() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        void IDisposable.Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(disposeContext);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}
