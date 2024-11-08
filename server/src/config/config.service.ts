import { config } from 'dotenv'
import * as yaml from 'js-yaml'
import { readFileSync } from 'fs'
import { join } from 'path'

export default () => {
  const env = process.env.NODE_ENV || 'development'

  const filePath = join(__dirname, `config.${env}.yaml`)
  const YAML_CONFIG = yaml.load(readFileSync(filePath, 'utf8'))

  return {
    ...YAML_CONFIG,
  } as Record<string, any>
}
