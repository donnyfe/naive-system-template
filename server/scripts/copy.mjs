import shelljs from 'shelljs'

shelljs.cp('-R', '.env.production', 'dist')
