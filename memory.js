const memory = (sizeInBytes) => {
  const buffer = new ArrayBuffer(sizeInBytes)
  const dataview = new DataView(buffer)
  return dataview
}

module.exports = memory
