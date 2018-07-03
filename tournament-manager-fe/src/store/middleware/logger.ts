export default function loggerMiddleware(store) {
  return next => action => {
    // tslint:disable-next-line:no-console
    console.log(action);
    return next(action);
  };
}
