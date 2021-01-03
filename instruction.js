const Instruction = {
  MOVE_LITERAL_REGISTER: 0x10,
  MOVE_REGISTER_REGISTER: 0x11,
  MOVE_REGISTER_MEMORY: 0x12,
  MOVE_MEMORY_REGISTER: 0x13,
  ADD_REGISTER_REGISTER: 0x14,
}

module.exports = Instruction
