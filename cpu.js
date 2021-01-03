const createMemory = require('./memory')
const { Register } = require('./register')
const Instruction = require('./instruction')

const multiplier16Bit = 2

class CPU {
  constructor(memory) {
    this.memory = memory

    this.registerNames = [
      Register.INSTRUCTION_POINTER,
      Register.RESULTS,
      Register.GENERAL_1,
      Register.GENERAL_2,
      Register.GENERAL_3,
      Register.GENERAL_4,
    ]

    this.registers = createMemory(this.registerNames.length * multiplier16Bit)

    this.registersMap = this.registerNames.reduce((result, name, index) => {
      result[name] = index * multiplier16Bit
      return result
    }, {})
  }

  debug() {
    this.registerNames.forEach((name) => {
      console.log(
        `${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`
      )
    })
    console.log()
  }

  viewMemoryAtAddress(address) {
    const nextEightBytes = Array.from({ length: 8 }, (_, key) =>
      this.memory.getUint8(address + key)
    ).map((val) => `0x${val.toString(16).padStart(2, '0')}`)

    console.log(
      `0x${address.toString(16).padStart(4, '0')}: ${nextEightBytes.join(' ')}`
    )
  }

  getRegister(name) {
    if (!name in this.registersMap) {
      throw new Error(`Register called ${name} not found`)
    }

    return this.registers.getUint16(this.registersMap[name])
  }

  setRegister(name, value) {
    if (!name in this.registersMap) {
      throw new Error(`Register called ${name} not found`)
    }

    return this.registers.setUint16(this.registersMap[name], value)
  }

  fetch8BitInstruction() {
    // Find the next instruction address
    const nextInstructionAddress = this.getRegister(
      Register.INSTRUCTION_POINTER
    )
    // Get the actual instruction from memory
    const instruction = this.memory.getUint8(nextInstructionAddress)
    // Increment the instruction pointer by 1
    this.setRegister(Register.INSTRUCTION_POINTER, nextInstructionAddress + 1)
    // Return the instruction
    return instruction
  }

  fetch16BitInstruction() {
    // Find the next instruction address
    const nextInstructionAddress = this.getRegister(
      Register.INSTRUCTION_POINTER
    )
    // Get the actual instruction from memory
    const instruction = this.memory.getUint16(nextInstructionAddress)
    // Increment the instruction pointer by 2
    this.setRegister(
      Register.INSTRUCTION_POINTER,
      nextInstructionAddress + multiplier16Bit
    )
    // Return the instruction
    return instruction
  }

  executeInstruction(instruction) {
    switch (instruction) {
      case Instruction.MOVE_LITERAL_REGISTER: {
        // Get binary literal from memory
        const literal = this.fetch16BitInstruction()
        // Get encoded register index
        const register =
          (this.fetch8BitInstruction() % this.registerNames.length) *
          multiplier16Bit
        // Move literal into register
        this.registers.setUint16(register, literal)
        return
      }

      case Instruction.MOVE_REGISTER_REGISTER: {
        // Get from and to registers
        const registerFrom =
          (this.fetch8BitInstruction() % this.registerNames.length) *
          multiplier16Bit
        const registerTo =
          (this.fetch8BitInstruction() % this.registerNames.length) *
          multiplier16Bit
        // Get value from register
        const value = this.registers.getUint16(registerFrom)
        // Set value in "to" register
        this.registers.setInt16(registerTo, value)
        return
      }

      case Instruction.MOVE_REGISTER_MEMORY: {
        const registerFrom =
          (this.fetch8BitInstruction() % this.registerNames.length) *
          multiplier16Bit
        const memoryAddress = this.fetch16BitInstruction()
        // Get value from register
        const value = this.registers.getUint16(registerFrom)
        // Set value into memory
        this.memory.setUint16(memoryAddress, value)
        return
      }

      case Instruction.MOVE_MEMORY_REGISTER: {
        const memoryAddress = this.fetch16BitInstruction()
        const registerTo =
          (this.fetch8BitInstruction() % this.registerNames.length) *
          multiplier16Bit
        // Get value from register
        const value = this.registers.getUint16(memoryAddress)
        // Set value in "to" register
        this.registers.setUint16(registerTo, value)
        return
      }

      // Add two registers, result sent to results register
      case Instruction.ADD_REGISTER_REGISTER: {
        const register1 = this.fetch8BitInstruction()
        const register2 = this.fetch8BitInstruction()
        const register1Value = this.registers.getUint16(
          register1 * multiplier16Bit
        )
        const register2Value = this.registers.getUint16(
          register2 * multiplier16Bit
        )
        // Set value in "results" register
        this.setRegister(Register.RESULTS, register1Value + register2Value)
        return
      }
    }
  }

  step() {
    const instruction = this.fetch8BitInstruction()
    return this.executeInstruction(instruction)
  }
}

module.exports = CPU
