export const PI = Math.PI
export const TWO_PI = PI * 2

export function fractalTree(ctx, len, x0, y0, angle) {
    treeBranch(ctx, len, 1, x0, y0, angle)
    return ctx
  }
  
  export function treeBranch(ctx, len, counter, x0, y0, angle) {
    if (counter==0){
      ctx.save()
      ctx.moveTo(x0, y0)
      ctx.rotate(Math.PI/3)
      ctx.lineTo(x0-len,y0-len)
    } else {
    }
    ctx.beginPath()
    ctx.save()
    ctx.translate(x0, y0)
    if (counter==1) {
      ctx.rotate(Math.PI/180)
    } else {
      ctx.rotate(angle * Math.PI/180)
    }
    ctx.moveTo(0,0)
    ctx.lineTo(0,-len)
    ctx.stroke()
    if (len<5) {
      ctx.restore()
      return
    }
    treeBranch(ctx, 0.7*len, counter+1, 0, -len, angle)
    treeBranch(ctx, 0.6*len, counter+1, 0, -len, -angle)
    ctx.restore()
  }