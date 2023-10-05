const fs = require('fs');

class FileReader {
  constructor(fileName) {
    this.fileName = fileName;
  }

  readLinesFromFile = () => {
    try {
      const fileContent = fs.readFileSync(this.fileName, 'utf8');
      const lines = fileContent.split('\n');
      return lines;
    } catch (error) {
      console.error('Error reading file:', error.message);
      return [];
    }
  };
}

module.exports = FileReader;