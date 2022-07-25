export class JsonOperations {
  static tryParse(data: unknown) {
    if(typeof data === 'string') {
      try {
        return JSON.parse(data);
      }
      catch {
        return {};
      }
    }
    else if(typeof data === 'object') {
      return data;
    }
  }
}
