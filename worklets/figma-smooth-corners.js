registerPaint(
  'figma-smooth-corners',
  class SmoothCornersPainter {
    static get inputProperties() {
      return ['--corner-radius', '--corner-smoothing'];
    }

    toRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }

    drawTopRightPath({ cornerRadius, width, height, a, b, c, d, p, circularSectionLength }) {
      if (cornerRadius) {
        return `
    M ${Math.max(width / 2, width - p)} 0
    C ${width - (p - a)} 0 ${width - (p - a - b)} 0 ${width - (p - a - b - c)} ${d}
    a ${cornerRadius} ${cornerRadius} 0 0 1 ${circularSectionLength} ${circularSectionLength}
    C ${width} ${p - a - b}
        ${width} ${p - a}
        ${width} ${Math.min(height / 2, p)}`;
      } else {
        return `M ${width / 2} 0
    L ${width} ${0}
    L ${width} ${height / 2}`;
      }
    }

    drawBottomRightPath({ cornerRadius, width, height, a, b, c, d, p, circularSectionLength }) {
      if (cornerRadius) {
        return `
    L ${width} ${Math.max(height / 2, height - p)}
    C ${width} ${height - (p - a)}
      ${width} ${height - (p - a - b)}
      ${width - d} ${height - (p - a - b - c)}
    a ${cornerRadius} ${cornerRadius} 0 0 1 -${circularSectionLength} ${circularSectionLength}
    C ${width - (p - a - b)} ${height}
      ${width - (p - a)} ${height}
      ${Math.max(width / 2, width - p)} ${height}`;
      } else {
        return `L ${width} ${height}
    L ${width / 2} ${height}`;
      }
    }

    drawBottomLeftPath({ cornerRadius, width, height, a, b, c, d, p, circularSectionLength }) {
      if (cornerRadius) {
        return `
    L ${Math.min(width / 2, p)} ${height}
    C ${p - a} ${height}
      ${p - a - b} ${height}
      ${p - a - b - c} ${height - d}
    a ${cornerRadius} ${cornerRadius} 0 0 1 -${circularSectionLength} -${circularSectionLength}
    C 0 ${height - (p - a - b)}
      0 ${height - (p - a)}
      0 ${Math.max(height / 2, height - p)}`;
      } else {
        return `
    L ${0} ${height}
    L ${0} ${height / 2}`;
      }
    }

    drawTopLeftPath({ cornerRadius, width, height, a, b, c, d, p, circularSectionLength }) {
      if (cornerRadius) {
        return `
    L 0 ${Math.min(height / 2, p)}
    C 0 ${p - a}
      0 ${p - a - b}
      ${d} ${p - a - b - c}
    a ${cornerRadius} ${cornerRadius} 0 0 1 ${circularSectionLength} -${circularSectionLength}
    C ${p - a - b} 0
      ${p - a} 0
      ${+Math.min(width / 2, p)} 0
    Z`;
      } else {
        return `L ${0} ${0}
    Z`;
      }
    }

    getPathParamsForCorner({ cornerRadius, cornerSmoothing, width, height }) {
      const maxRadius = Math.min(width, height) / 2;
      cornerRadius = Math.min(cornerRadius, maxRadius);

      const p = Math.min((1 + cornerSmoothing) * cornerRadius, maxRadius);

      let angleAlpha, angleBeta;

      if (cornerRadius <= maxRadius / 2) {
        angleBeta = 90 * (1 - cornerSmoothing);
        angleAlpha = 45 * cornerSmoothing;
      } else {
        const diffRatio = (cornerRadius - maxRadius / 2) / (maxRadius / 2);

        angleBeta = 90 * (1 - cornerSmoothing * (1 - diffRatio));
        angleAlpha = 45 * cornerSmoothing * (1 - diffRatio);
      }

      const angleTheta = (90 - angleBeta) / 2;
      const p3ToP4Distance = cornerRadius * Math.tan(this.toRadians(angleTheta / 2));
      const circularSectionLength = Math.sin(this.toRadians(angleBeta / 2)) * cornerRadius * Math.sqrt(2);

      const c = p3ToP4Distance * Math.cos(this.toRadians(angleAlpha));
      const d = c * Math.tan(this.toRadians(angleAlpha));
      const b = (p - circularSectionLength - c - d) / 3;
      const a = 2 * b;

      return { a, b, c, d, p, width, height, circularSectionLength, cornerRadius };
    }

    paint(ctx, geom, properties) {
      const cornerRadius = properties.get('--corner-radius').toString().replace(/ /g, '') || 0;
      const cornerSmoothing = properties.get('--corner-smoothing').toString().replace(/ /g, '') || 0;

      const defaultPathParams = this.getPathParamsForCorner({
        width: geom.width,
        height: geom.height,
        cornerRadius: parseInt(cornerRadius),
        cornerSmoothing: parseFloat(cornerSmoothing),
      });

      const path = new Path2D(
        `${this.drawTopRightPath(defaultPathParams)}${this.drawBottomRightPath(
          defaultPathParams
        )}${this.drawBottomLeftPath(defaultPathParams)}${this.drawTopLeftPath(defaultPathParams)}`
          .replace(/[\t\s\n]+/g, ' ')
          .trim()
      );

      ctx.fillStyle = '#000';
      ctx.stroke(path);
      ctx.fill(path);
    }
  }
);
